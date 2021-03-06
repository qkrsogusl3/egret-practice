// abstract class CustomParticle extends particle.Particle {

// }
// abstract class CustomParticleSystem<T extends CustomParticle> extends particle.ParticleSystem {


//     public constructor(particle: IConstructor<T>, texture: egret.Texture) {
//         super(texture, 0);
//         this.particleClass = particle;
//     }

//     public abstract initParticle(particle: T): void;

//     public abstract advanceParticle(particle: T, dt: number): void;
// }

// class MyParticle extends CustomParticle {

// }   
// class MyParticleSystem extends CustomParticleSystem<MyParticle>{

//     private _texture: egret.Texture = null;
//     private _config: any = null;

//     public constructor(particle: IConstructor<MyParticle>, texture: egret.Texture, config: any) {
//         super(particle, texture);
//         this._texture = texture;
//         this._config = config;
//         this.emissionRate = 4;
//     }


//     public initParticle(particle: MyParticle): void {
//         particle.currentTime = 0;
//         particle.totalTime = 10000;
//         console.log('init:',particle);
//     }

//     public advanceParticle(particle: MyParticle, dt: number): void {
//         console.log('ad:',particle);
//     }
// }

class IntroScene extends Scene {

    private eui: EuiTest = null;
    private missileContaner: GameObject = null;

    private missileCount: number = 1000;

    private isEui: boolean = false;

    protected preload(): void {
        super.preload();

        this.load.config("resource/default.res.json");
        this.load.theme("resource/default.thm.json");
        this.load.group('preload');
    }

    protected onPreloading(progress: number): void {
        console.log(progress);
    }

    public create(): void {
        super.create();

        return;
        SceneManager.loadScene(TitleScene);

        return;

        let width = this.stage.stageWidth;
        let height = this.stage.stageHeight;

        let background: RectDisplay = EgretObject.create(RectDisplay, this);
        background.draw(width, height);


        let hor: LineDisplay = EgretObject.create(LineDisplay, background);
        hor.draw(0, height * .5, width, 0, (setter) => setter(6, 0xff0000));

        let vert: LineDisplay = EgretObject.create(LineDisplay, background);
        vert.draw(width * .5, 0, 0, height, (setter) => setter(2, 0xff0000));

        this.missileContaner = EgretObject.create();
        loop.range(this.missileCount, () => {
            this.missileContaner.add(EgretObject.create(DisplayMissile));
        });


        this.eui = new EuiTest();
        loop.range(this.missileCount * .5, () => {
            this.eui.addMissile(new EuiMissile());
        });


        this.add(this.missileContaner);
        this.missileContaner.x = this.missileContaner.parent.measuredWidth * .5;
        this.missileContaner.y = this.missileContaner.parent.measuredHeight * .5;
        this.setEnableUpdate(true);

        Observer.onTouchEndObservable(this.stage).subscribe(() => {
            this.toggle();
        });
    }

    private toggle(): void {
        this.isEui = !this.isEui;
        if (this.isEui) {
            this.parent.addChild(this.eui);
            this.remove(this.missileContaner);
        } else {
            this.add(this.missileContaner);
            this.parent.removeChild(this.eui);
        }
    }

    protected onUpdate(deltaTime): void {
        super.onUpdate(deltaTime);

        if (this.isEui) {
            for (let m of this.eui.getChildren()) {
                m.onUpdate();
            }
        } else {
            for (let m of this.missileContaner.getChildren()) {
                (m as DisplayMissile).onUpdate();
            }
        }
    }
}

class DisposeTest extends EgretObject {

    protected onAwake(): void {
        super.onAwake();

        let a = new Observer.ReactiveProperty<number>(0);
        let b = a.asObservable();
        b.subscribe((value) => console.log('event:',value), () => { }, () => console.log('dispose'))
            .addTo(Game.adder(this));

        b.value = 10;

        a.onCompleted();

        b.value = 1;
        
    }
}