import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUser } from './decorator/get-user.decorator';
import { ForgotDto, LoginDto, ResetDto, SignupDto } from './dto/auth.dto';
import { JwtGuard } from './guard/jwt.guard';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: SignupDto) {
    return this.authService.signup({ data: body });
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.login({ data: body });

    return user;
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  profile(@GetUser('id') userId: string) {
    return this.authService.profile({
      userId: userId,
    });
  }

  @Get('/verify/:token')
  async verify(@Param('token') token: string) {
    try {
      await this.authService.verifyEmailToken(token);

      return 'Email Verified Successfully';
    } catch (error) {
      return error.message;
    }
  }

  @Post('/forgot')
  async forgot(@Body() body: ForgotDto) {
    await this.authService.sendResetEmail(body.email);

    return {
      message: 'Reset link sent to your email',
    };
  }

  @Get('/set-password/:token')
  async validateSetPasswordToken(@Param('token') token: string) {
    await this.authService.validateResetPasswordToken(token);

    return {
      isValid: true,
    };
  }

  @Post('/set-password')
  async setPassword(@Body() body: ResetDto) {
    const tokenDetails = await this.authService.validateResetPasswordToken(
      body.token,
    );

    await this.authService.setPassword(
      body.token,
      body.password,
      tokenDetails.email,
    );

    return {
      message: 'Password updated successfully',
    };
  }
}
